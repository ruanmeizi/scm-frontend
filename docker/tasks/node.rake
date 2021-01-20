# frozen_string_literal: true
config = JSON.parse(File.read('docker/dockerconfig.json'))
pname="node"
namespace :node do
  desc 'build node docker image '
  task :build do
    exec_cmd("TAG=#{TAG} docker build -t node:vitality_mdm -f #{config.docker_node_file} .")
  end

  desc 'release node image '
  task :release do |_t, _args|
      image_name = "node:vitality_mdm "
      remote_image = "registry.cn-beijing.aliyuncs.com/vitalitytexpub/#{image_name}"
      tag_cmd = "docker tag #{image_name} #{remote_image}"
      exec_cmd(tag_cmd)
      push_cmd = "docker push #{remote_image}"
      exec_cmd(push_cmd)
      rmi_cmd = "docker rmi #{remote_image}"
      exec_cmd(rmi_cmd)
  end


  desc 'compile project'
  task :compile do
      build_cmd="bash -lc \"cd /usr/src/app;rm -rf dist; cnpm install;cnpm run test\""
      hammer.run("docker-compose  -p#{pname} -f  #{config.node_yml} run node #{build_cmd}")
  end
end
