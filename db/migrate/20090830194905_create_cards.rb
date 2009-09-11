class CreateCards < ActiveRecord::Migration
  def self.up
    create_table :cards do |t|
      t.integer :user_id
      t.integer :frame
      t.text :message
      t.boolean :add_map
      t.boolean :copy_me
      t.float :lat
      t.float :lng

      t.timestamps
    end
  end

  def self.down
    drop_table :cards
  end
end
