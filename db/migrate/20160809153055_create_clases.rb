class CreateClases < ActiveRecord::Migration
  def change
    create_table :clases do |t|
      t.belongs_to :actividad, index: true
      t.date :fecha
      t.string :horario
      t.integer :max_users
      t.string :instructor
      t.boolean :cancelada
      t.string :comment

      t.timestamps
    end
  end
end
