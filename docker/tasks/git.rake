# frozen_string_literal: true
config = JSON.parse(File.read('docker/dockerconfig.json'))

namespace :git do
  desc 'create branches dev,test,prod and push them to remote repository'
  task :create do |_t, _args|
    exec_cmd("git checkout -b dev")
    exec_cmd("git checkout -b test")
    exec_cmd("git checkout -b prod")
    exec_cmd("git push origin test")
    exec_cmd("git push origin dev")
    exec_cmd("git push origin prod")
  end

end
