json.array! @events do |event|
  json.(event, :id, :content, :name, :created_at)
end




