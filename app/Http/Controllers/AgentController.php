<?php

namespace App\Http\Controllers;

use App\Ai\Agents\SalesCoach;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AgentController extends Controller
{
	public function callAgent(Request $request): string
	{
		$validated = $request->validate([
			'message' => ['required']
		]);
		$user = auth()->user();
		$input = $validated['message'];

		// Create or get conversation
		$conversation = DB::table('agent_conversations')
			->where('user_id', $user->id ?? null)
			->orderByDesc('updated_at')
			->first();

		if (!$conversation) {
			$conversationId = (string) Str::uuid();
			DB::table('agent_conversations')->insert([
				'id' => $conversationId,
				'user_id' => $user->id ?? null,
				'title' => 'Chat with Agent',
				'created_at' => now(),
				'updated_at' => now(),
			]);
		} else {
			$conversationId = $conversation->id;
			DB::table('agent_conversations')->where('id', $conversationId)->update(['updated_at' => now()]);
		}

		// Store user message
		$userMessageId = (string) Str::uuid();
		DB::table('agent_conversation_messages')->insert([
			'id' => $userMessageId,
			'conversation_id' => $conversationId,
			'user_id' => $user->id ?? null,
			'agent' => 'SalesCoach',
			'role' => 'user',
			'content' => $input,
			'attachments' => '',
			'tool_calls' => '',
			'tool_results' => '',
			'usage' => '',
			'meta' => '',
			'created_at' => now(),
			'updated_at' => now(),
		]);

		$response = SalesCoach::make($user)->prompt($input);
		$output = (string) $response;

		// Store agent response
		$agentMessageId = (string) Str::uuid();
		DB::table('agent_conversation_messages')->insert([
			'id' => $agentMessageId,
			'conversation_id' => $conversationId,
			'user_id' => $user->id ?? null,
			'agent' => 'SalesCoach',
			'role' => 'assistant',
			'content' => $output,
			'attachments' => '',
			'tool_calls' => '',
			'tool_results' => '',
			'usage' => '',
			'meta' => '',
			'created_at' => now(),
			'updated_at' => now(),
		]);

		return $output;
	}

	/**
	 * Get all conversations and messages for the authenticated user.
	 */
	public function chatHistory(Request $request)
	{
		$user = auth()->user();
		$convs = DB::table('agent_conversations')
			->where('user_id', $user->id ?? null)
			->orderByDesc('updated_at')
			->get();
		$conversations = [];
		foreach ($convs as $conv) {
			$messages = DB::table('agent_conversation_messages')
				->where('conversation_id', $conv->id)
				->orderBy('created_at')
				->get(['id', 'role', 'content', 'created_at']);
			$conversations[] = [
				'id' => $conv->id,
				'title' => $conv->title,
				'created_at' => $conv->created_at,
				'messages' => $messages,
			];
		}
		return response()->json(['conversations' => $conversations]);
	}

	/**
	 * Delete a conversation for the authenticated user.
	 */
	public function deleteChatHistory(Request $request, $id)
	{
		$user = auth()->user();
		$conv = DB::table('agent_conversations')->where('id', $id)->where('user_id', $user->id ?? null)->first();
		if (!$conv) {
			return response()->json(['error' => 'Not found'], 404);
		}
		DB::table('agent_conversation_messages')->where('conversation_id', $id)->delete();
		DB::table('agent_conversations')->where('id', $id)->delete();
		return response()->json(['success' => true]);
	}
}
