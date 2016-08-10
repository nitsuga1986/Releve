class CreateAsistencia < ActiveRecord::Migration
  def change
    create_table :asistencia do |t|
      t.integer :clase_id
      t.integer :user_id

      t.timestamps
    end
  end
end
