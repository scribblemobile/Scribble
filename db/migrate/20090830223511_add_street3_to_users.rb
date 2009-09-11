class AddStreet3ToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :return_street, :text
  end

  def self.down
    remove_column :users, :return_street
  end
end
