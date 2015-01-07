class Game
  def self.random
    games = File.read("games/easy.txt").lines
    games.sample.strip.gsub('.', '0').split(//).map(&:to_i)
  end
end
