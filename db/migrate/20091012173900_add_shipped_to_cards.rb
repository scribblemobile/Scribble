class AddShippedToCards < ActiveRecord::Migration
  def self.up
    add_column :cards, :printer_status, :integer
  end

  def self.down
    remove_column :cards, :printer_status
  end
end
