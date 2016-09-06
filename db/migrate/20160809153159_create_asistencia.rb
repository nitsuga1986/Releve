class CreateAsistencia < ActiveRecord::Migration
  def change
    create_table :asistencia do |t|
      t.integer :user_id
      t.integer :clase_id
      t.boolean :confirmed, default: false

      t.timestamps
    end
  end
end
