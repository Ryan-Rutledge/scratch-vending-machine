function scratchLogicLoop(svm) {
	switch (svm.state()) {
		case 'A':
			svm.ask("Type 'start' to begin", function(answer) {
				if (answer.toLowerCase() === 'start') {
					svm.state('B');
				}
				else {
					svm.state('A');
				}
			});
			break;
		case 'B':
			svm.ask("Insert coin amount or type 'next' or 'refund'", function(answer) {
				switch(answer.toLowerCase()) {
					case 'next':
						if (svm.currency() >= 1.25) {
							svm.state('C');
						}
						else {
							svm.say('Not enough inserted.', function() {
								svm.state('B');
							});
						}
						break;
					case 'refund':
						svm.state('E');
						break;
					default:
						svm.currency(svm.currency() + (parseFloat(answer) || 0));
						svm.state('B');
						break;
				}
			});
			break;
		case 'C':
			function C(soda) {
				if (soda === 'refund') {
					svm.state('E');
				}
				else if (soda.count === undefined) {
					svm.state('C');
				}
				else if (soda.count > 0) {
					svm.slot(soda.index, soda.count - 1);
					svm.state('D');
				}
				else {
					svm.say('Not available', function() {
						svm.state('C');
					});
				}
			}
			svm.ask("Select a soda or type 'refund'", C);
			svm.click(C);
			break;
		case 'D':
			var clickedSoda = svm.clicked();
			svm.dispense(clickedSoda.index);
			svm.say('Dispensing ' + clickedSoda.name, function() {
				svm.takeItem();
				svm.currency(svm.currency() - 1.25);
				
				if (svm.currency() > 0) {
					svm.state('E');
				}
				else {
					svm.state('A');
				}
			});
			break;
		case 'E':
			svm.say('Returning $' + svm.refund().toFixed(2) + ' in change', function() {
				svm.takeRefund();
				svm.state('A');
			});
			break;
	}
}

function createSVM() {
	// Get DOM container for svm gui
	var container = document.getElementById('vmContainer');
	
	// Create new SVM object
	svm = new ScratchVendingMachine(container)
		.slot(0, 5, 'Cola', './cola.png', 1.25)
		.slot(1, 4, 'Lemon Lime', './lemonlime.png', 1.25)
		.slot(2, 9, 'Ginger Ale', 'gingerale', 1.25)
		.loop(scratchLogicLoop) // Set logic loop
		.state('A'); // Begin loop at state A
}
