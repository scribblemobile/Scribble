class AddReceiptToCards < ActiveRecord::Migration
  def self.up
    add_column :cards, :receipt, :text
  end

  def self.down
    remove_column :cards, :receipt
  end
end
