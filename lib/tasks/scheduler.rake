desc "This task is called by the Heroku scheduler add-on"

task :send_reminders => :environment do
	if Date.today.sunday? then
		@users = User.where('reminders', true)
		@users.each do |user|
			UserMailer.remainder_email(user).deliver
		end
	end
	
end
