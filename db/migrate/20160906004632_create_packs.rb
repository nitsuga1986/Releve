class CreatePacks < ActiveRecord::Migration
  def change
    create_table :packs do |t|
      t.belongs_to :user, index: true
      t.belongs_to :actividad, index: true
      t.integer :cantidad, default: 1
      t.boolean :noperiod, default: true
      t.date :fecha_start
      t.date :fecha_end

      t.timestamps
    end
  end
end
