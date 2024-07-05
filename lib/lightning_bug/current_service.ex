defmodule LightningBug.CurrentService do
	use GenServer

	@impl true
	def init(_) do
	{:ok, nil}
	end

	def start_link(_) do
		GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
	end

	def set(service) do
		GenServer.cast(__MODULE__, {:set, service})
	end

	def set_errors(errors) do
		GenServer.cast(__MODULE__, {:set_errors, errors})
	end

	def get() do
		GenServer.call(__MODULE__, :get)
	end

	@impl true
	def handle_cast({:set, service}, _state) do
		{:noreply, service}
	end

	@impl true
	def handle_cast({:set_errors, errors}, state) do
		new_state = Map.put(state, :errors, errors)
		{:noreply, new_state}
	end

	@impl true
	def handle_call(:get, _from, state) do
		{:reply, state, state}
	end

	@impl true
	def terminate(reason, state) do
		IO.inspect(reason)
		IO.inspect(state)
	end
end