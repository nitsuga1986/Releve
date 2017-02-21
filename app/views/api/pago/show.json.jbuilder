json.(@pago, :id, :monto, :mes, :cant_clases, :fecha, :user_id, :actividad_id)
json.cobrador @pago.cobrador.nombre_completo
