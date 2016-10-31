desc "This task is called by the Heroku scheduler add-on"

task :send_reminders => :environment do
	if Date.today.sunday? then
		@users = User.where('reminders', true)
		start_date = Date.today
		end_date = start_date + 7.days
		@users.each do |user|
			@clases = user.clases.where(:fecha => start_date..end_date).order(:fecha,:horario)
			if !(@clases.count == 0) then
				UserMailer.remainder_email(user,@clases).deliver
			end
		end
	end
end
