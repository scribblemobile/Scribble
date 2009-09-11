class AddFieldsToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :email, :string
    add_column :users, :password, :string
    add_column :users, :login_count, :integer
    add_column :users, :device_id, :string
    add_column :users, :device_model, :string
    add_column :users, :phone_os, :string
    add_column :users, :draftphoto_file_name, :string
    add_column :users, :draftphoto_content_type, :string
    add_column :users, :draftphoto_file_size, :integer
    add_column :users, :scribble_version, :string
  end

  def self.down
    remove_column :users, :scribble_version
    remove_column :users, :draftphoto_file_size
    remove_column :users, :draftphoto_content_type
    remove_column :users, :draftphoto_file_name
    remove_column :users, :phone_os
    remove_column :users, :device_model
    remove_column :users, :device_id
    remove_column :users, :login_count
    remove_column :users, :password
    remove_column :users, :email
  end
end
