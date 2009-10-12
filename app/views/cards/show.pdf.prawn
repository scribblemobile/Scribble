pdf = Prawn::Document.new(:page_size => [414, 324], :margins=>0)



pdf.bounding_box [0,288], :width => 414 do
	pigs = "#{RAILS_ROOT}/public/images/cards/frame1.jpg" 
	pdf.image pigs, :at => [-36,0], :fit => [414, 324]
	
		pdf.canvas do
	    pdf.bounding_box([33,292], :width => 215) do
	
			pigs = "#{RAILS_ROOT}/public/images/cards/testpic.jpg" 
			pdf.image pigs, :at => [0,0], :fit => [215, 215]
			
	
	    end
	end
	


end



pdf.bounding_box [230,250], :width => 110 do
		pdf.font "#{RAILS_ROOT}/public/images/cards/mafw.ttf"
	  	pdf.text "Hello my nick is Ralph. I like testing software. Yay, I really really do. Can you say 160 characters? I can. And I'm almost there. Just a few more.", :leading=>5
end

pdf.start_new_page


pdf.bounding_box [0,288], :width => 414 do
	pigs = "#{RAILS_ROOT}/public/images/cards/back.jpg" 
	pdf.image pigs, :at => [-36,0], :fit => [414, 324]
end