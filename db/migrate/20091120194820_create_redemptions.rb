class CreateRedemptions < ActiveRecord::Migration
  def self.up
    create_table :redemptions do |t|
      t.text :code
      t.text :device_id

      t.timestamps
    end
  end

  def self.down
    drop_table :redemptions
  end
end
