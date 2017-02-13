class AddMonthsToPacks < ActiveRecord::Migration
  def change
    add_column :packs, :cantidad01, :integer, default: 1
    add_column :packs, :cantidad02, :integer, default: 1
    add_column :packs, :cantidad03, :integer, default: 1
    add_column :packs, :cantidad04, :integer, default: 1
    add_column :packs, :cantidad05, :integer, default: 1
    add_column :packs, :cantidad06, :integer, default: 1
    add_column :packs, :cantidad07, :integer, default: 1
    add_column :packs, :cantidad08, :integer, default: 1
    add_column :packs, :cantidad09, :integer, default: 1
    add_column :packs, :cantidad10, :integer, default: 1
    add_column :packs, :cantidad11, :integer, default: 1
    add_column :packs, :cantidad12, :integer, default: 1
  end
end
