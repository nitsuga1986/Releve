class CreatePagos < ActiveRecord::Migration
  def change
    create_table :pagos do |t|
      t.belongs_to :user, index: true
      t.belongs_to :actividad, index: true
      t.integer :monto
      t.integer :mes
      t.integer :cant_clases
      t.date :fecha
      t.string :descripcion

      t.timestamps
    end
  end
end
