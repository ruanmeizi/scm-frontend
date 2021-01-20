# frozen_string_literal: true
config = JSON.parse(File.read('docker/dockerconfig.json'))
pname="external"
service_name="pg_db"
namespace :db do
  desc 'db setup 2'
  pname="external"
  task :setup2 do
    ['db:create', 'db:migrate', 'db:seed'].each do |t|
      Rake::Task[t.to_s].invoke
    end
  end

  desc 'up global db services'
  task :up do |_t, _args|
    exec_cmd("docker-compose -p#{pname} -f  #{config.db_yml} up -d")
  end


  desc 'container logs'
  task :logs, [:service] do |_t, args|
    exec_cmd("TAG=#{TAG} docker-compose -p#{pname} -f #{config.db_yml} logs -f #{args[:service] ||  service_name}")
  end

end
