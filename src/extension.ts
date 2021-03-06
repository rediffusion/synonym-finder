// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from "node-fetch";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "synonym-finder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// Каждый раз после клика в `quickPicker` выполняется данная команда
	// vscode - эта запись позволяет взаимодействовать с чем угодно в данном IDE
	// async - типа callback ссылающийся к `await` fetch
	let disposable = vscode.commands.registerCommand('extension.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed

		// Получаем доступ к <<VS Code>>
		const editor = vscode.window.activeTextEditor;
		// Если нету !editor
		if (!editor) {
		vscode.window.showInformationMessage("editor does not exist");	
			return;
		}

		const text = editor.document.getText(editor.selection);
		// vscode.window.showInformationMessage(`selected text: ${text}`); // ${text} - Для теста. Текст который выделен будет выводиться в всплывающей подсказке внизу. F1 > find synonyms
		// https://www.datamuse.com/api/ - выбираем API на сайте
		// const response = await fetch("https://api.datamuse.com/words?ml=exit");
		// replace(" ", "+") - как понял эта запись даёт возможность отсеивать нужные слова `quickPicker` - "F1 > find synonyms" вписать в поле слово (пример "blue" - печатаем "bl" будут показаны варианты которые начинаются с этих букв).
		const response = await fetch(`https://api.datamuse.com/words?ml=${text.replace(" ", "+")}`);
		// Это типа ссылка имеет в себе записи в формате .json и мы их парсим/получаем и кладём в переменную 'data'
		const data = await response.json();
		// https://github.com/microsoft/vscode-extension-samples/blob/master/quickinput-sample/src/extension.ts (взяли часть кода и немного подредактировали) - QuickPicker, это типа когда нажимаем на F1 и видим варианты для выбора/pick.
		const quickPick = vscode.window.createQuickPick();
		// x.word - это API которое можно посмотреть перейдя поссылке https://api.datamuse.com/words?ml=exit смотрим word: "departure" - это оно кароче.
		// label - это то что будет выводить 'picker'.
		// x: any - что нибудь
		quickPick.items = data.map((x: any) => ({ label: x.word }));
		// item - отдельный пункт
		quickPick.onDidChangeSelection(([item]) => {
			if (item) {
				// vscode.window.showInformationMessage(item.label);
				editor.edit((edit) => {
					// Будет происходит замена на выбранное слово из `quickPikcer`.
					edit.replace(editor.selection, item.label);
				});	
				quickPick.dispose();
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();

	});

//Это удалит одноразовую память, возвращаемую методом команды create для освобождения памяти
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
