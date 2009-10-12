class AddJobToCards < ActiveRecord::Migration
  def self.up
    add_column :cards, :job_id, :integer
  end

  def self.down
    remove_column :cards, :job_id
  end
end
