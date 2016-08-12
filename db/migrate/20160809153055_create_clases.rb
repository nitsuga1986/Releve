class CreateClases < ActiveRecord::Migration
  def change
    create_table :clases do |t|
      t.date :fecha
      t.string :horario
      t.string :actividad
      t.integer :max_users
      t.string :instructor
      t.boolean :cancelada
      t.string :comment

      t.timestamps
    end
  end
end
