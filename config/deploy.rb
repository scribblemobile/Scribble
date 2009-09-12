# Please install the Engine Yard Capistrano gem
# gem install eycap --source http://gems.engineyard.com
require "eycap/recipes"

set :keep_releases, 5
set :application,   'Scribble'
set :repository,    'git://github.com/scribblemobile/Scribble.git'
set :deploy_to,     "/data/#{application}"
set :deploy_via,    :export
set :monit_group,   "#{application}"
set :scm,           :git
set :user,          'scribble'
set :password,      'HQQRU7pTx4'
set :git_enable_submodules, 1
# This is the same database name for all environments
set :production_database,'Scribble_production'

set :environment_host, 'localhost'
set :deploy_via, :remote_cache

# uncomment the following to have a database backup done before every migration
# before "deploy:migrate", "db:dump"

# comment out if it gives you trouble. newest net/ssh needs this set.
ssh_options[:paranoid] = false
default_run_options[:pty] = true
ssh_options[:forward_agent] = true
default_run_options[:pty] = true # required for svn+ssh:// andf git:// sometimes

# This will execute the Git revision parsing on the *remote* server rather than locally
set :real_revision, 			lambda { source.query_revision(revision) { |cmd| capture(cmd) } }


task :Scribble do
  role :web, '174.129.21.247'
  role :app, '174.129.21.247'
  role :db, '174.129.21.247', :primary => true
  set :environment_database, Proc.new { production_database }
  set :dbuser,        'scribble'
  set :dbpass,        'HQQRU7pTx4'
  set :user,          'scribble'
  set :password,      'HQQRU7pTx4'
  set :runner,        'scribble'
  set :rails_env,     'production'
end



desc "tail production log files" 
task :tail do
  role :app, '174.129.21.247'
  run "tail -f /data/#{application}/current/log/production.log" do |channel, stream, data|
    puts  # for an extra line break before the host name
    puts "#{channel[:host]}: #{data}" 
    break if stream == :err    
  end
end


namespace(:customs) do
  task :symlink_cards, :roles => :app do
    run <<-CMD
      ln -s #{shared_path}/cards #{release_path}/public/cards
    CMD
  end
  task :symlink_users, :roles => :app do
    run <<-CMD
      ln -s #{shared_path}/users #{release_path}/public/users
    CMD
  end
end


# TASKS
# Don't change unless you know what you are doing!

after "deploy", "deploy:cleanup"
after "deploy:migrations", "deploy:cleanup"
after "deploy:update_code","deploy:symlink_configs"
after "deploy:update_code","customs:symlink_users"
after "deploy:update_code","customs:symlink_cards"
