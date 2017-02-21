class AddCobradorToPagos < ActiveRecord::Migration
  def change
    add_column :pagos, :cobrador, :integer, index: true
  end
end
