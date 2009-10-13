pdf = Prawn::Document.new(:page_size => [414, 324], :margins=>0)


if params[:front] == "true"
pdf.bounding_box [0,288], :width => 414 do
	pigs = "#{RAILS_ROOT}/public/images/cards/frame#{@card.frame}.jpg" 
	pdf.image pigs, :at => [-36,0], :fit => [414, 324]
	
		pdf.canvas do
	    pdf.bounding_box([33,292], :width => 215) do
	
		pigs = "#{RAILS_ROOT}/public/cards/#{@card.id}/original_#{@card.photo}" 
		pdf.image pigs, :at => [0,0], :fit => [215, 215]
			
	    end
	end
	


end



pdf.bounding_box [230,250], :width => 110 do
		pdf.font "#{RAILS_ROOT}/public/images/cards/mafw.ttf"
	  	pdf.text @card.message, :leading=>5
end

pdf.render_file "front.pdf"


else


pdf.bounding_box [0,288], :width => 414 do
	pigs = "#{RAILS_ROOT}/public/images/cards/back.jpg" 
	pdf.image pigs, :at => [-36,0], :fit => [414, 324]
end

pdf.render_file "back.pdf"

end


