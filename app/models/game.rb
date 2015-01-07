class Game
  def self.random
    games = File.read("games/easy.txt").lines
    games.sample.strip
  end
end
