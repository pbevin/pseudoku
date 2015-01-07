class GamesController < ApplicationController
  def index
    @board = Game.random
  end
end
