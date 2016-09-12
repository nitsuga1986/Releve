class CreateAsistencia < ActiveRecord::Migration
  def change
    create_table :asistencia do |t|
      t.belongs_to :user, index: true
      t.belongs_to :clase, index: true
      t.boolean :confirmed, default: false
      t.timestamps
    end
  end
end
