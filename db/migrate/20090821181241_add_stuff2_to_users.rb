class AddStuff2ToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :return_address1, :string
    add_column :users, :return_address2, :string
    add_column :users, :return_city, :string
    add_column :users, :return_state, :string
    add_column :users, :return_zip, :string
    add_column :users, :return_country, :string
  end

  def self.down
    remove_column :users, :return_country
    remove_column :users, :return_zip
    remove_column :users, :return_state
    remove_column :users, :return_city
    remove_column :users, :return_address2
    remove_column :users, :return_address1
  end
end
