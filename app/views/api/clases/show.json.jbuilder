json.(@clase, :id, :actividad_id, :cancelada, :comment, :duracion, :dia, :fecha, :horario, :max_users, :trialable, :completa?, :old?, :cancelable?)
json.actividad 		@clase.actividad.nombre
json.actividad_id 	@clase.actividad.id
json.users 			@clase.users, partial: 'api/users/user', as: :user
json.instructor 	@clase.instructor if @clase.instructor.present?
json.reemplazo	 	@clase.reemplazo if @clase.reemplazo.present?


