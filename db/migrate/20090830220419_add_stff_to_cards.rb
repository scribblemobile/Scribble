class AddStffToCards < ActiveRecord::Migration
  def self.up
    add_column :cards, :price_paid, :double
    add_column :cards, :photo, :text
  end

  def self.down
    remove_column :cards, :photo
    remove_column :cards, :price_paid
  end
end
