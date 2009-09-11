class AddFieldsToAddresses < ActiveRecord::Migration
  def self.up
    add_column :addresses, :street, :text
    add_column :addresses, :countryCode, :text
    add_column :addresses, :price, :text
    remove_column :addresses, :address1
    remove_column :addresses, :address2
    remove_column :addresses, :address3
  end

  def self.down
    remove_column :addresses, :price
    remove_column :addresses, :countryCode
    remove_column :addresses, :street
    add_column :addresses, :address1, :text
    add_column :addresses, :address2, :text
    add_column :addresses, :address3, :text
  end
end
