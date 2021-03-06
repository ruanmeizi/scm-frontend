# frozen_string_literal: true
config = JSON.parse(File.read('docker/dockerconfig.json'))
namespace :config do
  desc 'generate config files'
  task :gen do
    Dir['docker/*.erb'].each do |file|
      filename = file.gsub('.erb', '')
      File.write(filename, ERB.new(File.read(file)).result)
      puts "#{filename} is generated."
    end
  end
end
namespace :docker do
  TAG = ENV['TAG'] || 'latest'
  prod_yml = ENV['PROD_YAML'] || config.prod_yml
  docker_repo = ENV['DOCKER_REPO'] || config.docker_repo

  desc 'launch bash console for contaners'
  task :bash, [:service] do |_t, args|
    exec_cmd("TAG=#{TAG} docker-compose -f #{config.debug_yml} exec #{args[:service] || config.service_name} #{config.shell_command}")
  end

  desc 'container logs'
  task :logs, [:service] do |_t, args|
    exec_cmd("TAG=#{TAG} docker-compose -f #{config.debug_yml} logs -f #{args[:service] || config.service_name}")
  end

  desc 'Clean docker env'
  task :clean do |_t, _args|
    cmd = 'docker volume prune'
    hammer.say('volume are cleaned')
    exec_cmd(cmd)
    cmd = %(dk rmi none)
    hammer.say('useless images are cleaned')
    exec_cmd(cmd)
  end

  desc 'shut down a service or all services'
  task :down, [:service] do |_t, args|
    if args[:service]
      exec_cmd("TAG=#{TAG} docker-compose -f #{config.debug_yml} stop #{args[:service]}")
    else
      exec_cmd("TAG=#{TAG} docker-compose -f #{config.debug_yml} down")
    end
  end

  desc 'repull image'
  task :update, [:service] do |_t, args|
    exec_cmd("TAG=#{TAG} docker-compose -f #{config.debug_yml} pull #{args[:service]}")
  end

  desc 'run test'
  task test: :up do
    exec_cmd(%(TAG=#{TAG} docker-compose -f #{config.debug_yml} exec #{config.service_name} bash -lc "#{config.test_command}"))
  end

  desc 'start service with docker with prod env'
  task run: 'config:gen' do
    exec_cmd("TAG=#{TAG} dockese -f #{config.prod_yml} up  -d")
  end

  desc 'start app but not start   and   service'
  task up: 'config:gen' do |_, args|
      #Rake::Task["db:up"].invoke
      exec_cmd("TAG=#{TAG} docker-compose -f #{config.debug_yml}  up  -d #{args[:service]} ")
  end

  desc 'start   with debug mode'
  task debug: [:up] do
    exec_cmd(%(TAG=#{TAG} docker-compose -f #{config.debug_yml} exec #{config.service_name} bash -lc "#{config.debug_command}"))
  end

  desc 'start apps with dev mode of server'
  task dev: [:up] do
    exec_cmd(%(TAG=#{TAG} docker-compose -f #{config.debug_yml} exec  #{config.service_name} bash -lc "#{config.dev_command}"))
  end

  desc 'start apps with prod mode with nginx server'
  task :prod  do |_,args|
      exec_cmd("TAG=#{TAG} docker-compose -f #{config.prod_yml}  up  -d #{args[:service]} ")
  end

  desc 'start apps with deploy mode'
  task deploy: [:update, 'db:migrate'] do
    exec_cmd("TAG=#{TAG} docker-compose -f #{config.deploy_yml} up -d ")
    hammer.say 'Deploy Mode is started'
  end

  desc 'lint code '
  task lint: :up do
    exec_cmd(%(TAG=#{TAG} docker-compose -f #{config.debug_yml} exec -T #{config.service_name}  bash -lc "#{config.lint_command}"))
  end

  desc 'gitpull'
  task :gitpull do
    exec_cmd('git pull')
  end

  desc 'precheck before release'
  task precommit: %i[lint test gitpull] do |_t, _args|
    exec_cmd("TAG=#{TAG} docker-compose -f #{config.debug_yml} down")
    hammer.say 'Precommit succeed.'
  end

  desc 'build  docker image '
  task :build do
    hammer.say('NODE_ENV环境变量为空，请设定NODE_ENV环境变量') &&next if ENV["NODE_ENV"].nil?
    env="test" if ENV["NODE_ENV"]=="test"
    env="prod" if ENV["NODE_ENV"]=="prod"
    exec_cmd("TAG=#{TAG} docker build -t #{config.image_name}:#{TAG} -f #{config.docker_file}.#{env} .")
  end

  desc 'build maven docker image '
  task :build_maven do
    exec_cmd("TAG=#{TAG} docker build -t maven:vitality -f #{config.docker_maven_file} .")
  end

  desc 'Login remote docker repository'
  task :login do |_t, _args|
    login_cmd = 'docker login --username=yiliwei registry.cn-beijing.aliyuncs.com'
    exec_cmd(login_cmd)
  end


  desc 'build base docker image '
  task :build_base do
    exec_cmd("TAG=#{TAG} docker build -t #{config.image_name}:base -f #{config.docker_base_file} .")
  end

  desc 'release base image '
  task :release_base do |_t, _args|
    if `docker images -f reference=#{config.image_name}:base -q`.chop.empty?
      hammer.say('There is no local image for push')
    else
      image_name = "#{config.image_name}:base"
      remote_image = "#{docker_repo}/#{image_name}"
      tag_cmd = "docker tag #{image_name} #{remote_image}"
      exec_cmd(tag_cmd)
      push_cmd = "docker push #{remote_image}"
      exec_cmd(push_cmd)
      rmi_cmd = "docker rmi #{remote_image}"
      exec_cmd(rmi_cmd)
    end
  end

  desc 'release  image '
  task :release do |_t, _args|
    if `TAG=#{TAG} docker images -f reference=#{config.image_name}:#{TAG} -q`.chop.empty?
      hammer.say('There is no local image for push')
    else
      remote_image = "#{docker_repo}/#{config.image_name}:#{TAG}"
      tag_cmd = "TAG=#{TAG} docker tag #{config.image_name}:#{TAG} #{remote_image}"
      exec_cmd(tag_cmd)
      push_cmd = "TAG=#{TAG} docker push #{remote_image}"
      exec_cmd(push_cmd)
      rmi_cmd = "TAG=#{TAG} docker rmi #{remote_image}"
      exec_cmd(rmi_cmd)
      hammer.say('pls commit code and push it manually！！')
    end
  end

  desc 'release maven image '
  task :release_maven do |_t, _args|
      image_name = "maven:vitality "
      remote_image = "registry.cn-beijing.aliyuncs.com/vitalitytexpub/#{image_name}"
      tag_cmd = "docker tag #{image_name} #{remote_image}"
      exec_cmd(tag_cmd)
      push_cmd = "docker push #{remote_image}"
      exec_cmd(push_cmd)
      rmi_cmd = "docker rmi #{remote_image}"
      exec_cmd(rmi_cmd)
  end

  desc 'release fasdfs image '
  task :release_fastdfs do |_t, _args|
      image_name = "fastdfs:vitality "
      remote_image = "registry.cn-beijing.aliyuncs.com/vitalitytexpub/#{image_name}"
      tag_cmd = "docker tag #{image_name} #{remote_image}"
      exec_cmd(tag_cmd)
      push_cmd = "docker push #{remote_image}"
      exec_cmd(push_cmd)
      rmi_cmd = "docker rmi #{remote_image}"
      exec_cmd(rmi_cmd)
  end

  desc 'show docker config'
  task :info do
    last_build_time = `docker inspect -f '{{ .Created }}' #{config.image_name}`.chop
    last_build_time = Time.parse(last_build_time).localtime
    puts JSON.pretty_generate(config)
  end

  desc 'parse dockerfile and docker-compose'
  task :parse do
    match = ->(rexp) { File.open(config.docker_file).grep(rexp).first.match(rexp)[1] }
    service_config = YAML.load_file(prod_yml)
    image = service_config['services'][config.service_name]['image'].match(/((.*)\/)?(.*)/)
    image_name = image[3].gsub('${TAG}', ENV['TAG'] || 'latest')
    last_build_time = `docker inspect -f '{{ .Created }}' #{image_name}`.chop
    last_build_time = Time.parse(last_build_time).localtime
    ret = {
      base_image: match.call(/FROM (.*)/),
      author: match.call(/MAINTAINER (.*)/),
      docker_repo: image[2] || 'docker.io',
      image_name: image_name,
      last_build_at: last_build_time
    }
    File.write(config.docker_parse, ret.to_json)
    puts JSON.pretty_generate(ret)
  end
  desc 'restart docker app'
  task restart: %i[down dev] do
  end

  desc 'dump docker task '
  task :dump do
    target_path = hammer.ask('target path?:')
    hammer.directory('./docker', "#{target_path}/docker")
    hammer.copy_file('./lib/tasks/docker.rake', "#{target_path}/docker/docker.rake")
    target_rakefile = "#{target_path}/Rakefile"
    File.open(target_rakefile, 'a') do |f|
      f.puts "import 'docker/docker.rake'"
      f.puts "require 'json'"
    end
  end
end
