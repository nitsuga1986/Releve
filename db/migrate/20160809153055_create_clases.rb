class CreateClases < ActiveRecord::Migration
  def change
    create_table :clases do |t|
      t.belongs_to :actividad, index: true
      t.integer :instructor, index:true
      t.integer :reemplazo, index:true
      t.date :fecha
      t.string :horario
      t.integer :max_users
      t.boolean :cancelada, default: false
      t.boolean :trialable, default: true
      t.string :comment
      t.decimal :duracion, default: 1

      t.timestamps
    end
  end
end
