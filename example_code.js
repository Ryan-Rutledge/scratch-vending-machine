function scratchLogicLoop(svm) {
	switch (svm.state()) {
		case 'A':
			svm.say('Insert coins or click refund');

			switch(svm.reply()) {
				case 'refund':
					if (svm.currency() > 0) {
						svm.state('E');
					}
					break;
				default:
					svm.currency(svm.currency() + (parseFloat(svm.reply()) || 0));

					if (svm.currency() >= 1.25) {
						svm.state('B');
					}
					break;
			}
			break;
		case 'B':
			svm.say("Select a soda or click refund.");

			switch (svm.reply()) {
				case 'refund':
					svm.state('E');
					break;
				case 'soda':
					var soda = svm.clicked();
					if (soda && soda.count !== undefined) {
						svm.slot(soda.index, soda.count - 1);
						svm.state('C');
					}
					else {
						svm.say('Not available');
					}
					break;
			}
			break;
		case 'C':
			var soda = svm.clicked();
			svm.dispense(soda.index);
			svm.say('Dispensing ' + soda.name + '. Please remove soda from dispenser.');
			svm.currency(svm.currency() - 1.25);
			svm.state('D');
			break;
		case 'D':
			if (svm.reply() === 'dispense') {
				svm.takeItem();

				if (svm.currency() > 0) {
					svm.refund(svm.currency());
					svm.state('E');
				}
				else {
					svm.state('A');
				}
			}
			break;
		case 'E':
			svm.say('Returning $' + svm.refund().toFixed(2) + ' in change. Please remove change.');
			if (svm.reply() === 'cash') {
				svm.say();
				svm.takeRefund();
				svm.state('A');
			}
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
		.slot(2, 9, 'Ginger Ale', 'gingerale.png', 1.25)
		.loop(scratchLogicLoop) // Set logic loop
		.state('A'); // Begin loop at state A
}
