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

if @card.lat
	if @card.lat != 0

		s = Hash.new
	s[:pic_google_map]="http://maps.google.com/staticmap?center=#{@card.lat},#{@card.lng}&zoom=10&size=640x456&maptype=terrain&markers=#{@card.lat},#{@card.lng},red&key=ABQIAAAALF-_g5rNREDtjEue6txM3xQP7nTGYYVCHHTU9L3Hb_ZDidErMhSGz6PAfvIlqt6bAp17W_SZPV9HeA&format=jpg-baseline"
		pdf.bounding_box [149,270], :width => 210 do
		pdf.image open(s[:pic_google_map]), :at => [0,0], :fit => [210, 150]
	end
 end
end


pdf.render_file "back.pdf"

end


