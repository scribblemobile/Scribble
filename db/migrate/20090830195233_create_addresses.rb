class CreateAddresses < ActiveRecord::Migration
  def self.up
    create_table :addresses do |t|
      t.integer :card_id
      t.text :first_name
      t.text :last_name
      t.text :address1
      t.text :address2
      t.text :address3
      t.text :city
      t.text :state
      t.text :zip
      t.text :country

      t.timestamps
    end
  end

  def self.down
    drop_table :addresses
  end
end
