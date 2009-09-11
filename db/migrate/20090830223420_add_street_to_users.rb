class AddStreetToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :street, :text
  end

  def self.down
    remove_column :users, :street
  end
end
