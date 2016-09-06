class CreatePacks < ActiveRecord::Migration
  def change
    create_table :packs do |t|
      t.integer :user_id
      t.integer :actividad_id
      t.integer :cantidad, default: 1
      t.boolean :clase_de_prueba, default: true

      t.timestamps
    end
  end
end
