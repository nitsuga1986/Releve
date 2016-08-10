class CreateClases < ActiveRecord::Migration
  def change
    create_table :clases do |t|
      t.integer :user_id
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
