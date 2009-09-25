#pdf = Prawn::Document.new(:page => "LETTER")
pdf = Prawn::Document.new(:background => "#{RAILS_ROOT}/public/images/cards/frame1.png", :page_size => [1725, 1350], :margin=>0)


pdf.text "hi"
pigs = "#{RAILS_ROOT}/public/images/rails.png" 
pdf.image pigs, :at => [1,1], :width => 50