class CreateWaitLists < ActiveRecord::Migration
  def change
    create_table :wait_lists do |t|
      t.belongs_to :user, index: true
      t.belongs_to :clase, index: true
      t.timestamps
    end
  end
end
