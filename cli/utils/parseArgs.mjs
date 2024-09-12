export function parseArgs(args) {
    const result = {
        command: null,
        options: {},
        parameters: []
    };

    if (args.length > 0) {
        // The first argument is the command
        result.command = args[0];
        
        // Process options and parameters
        for (let i = 1; i < args.length; i++) {
            if (args[i].startsWith('--')) {
                result.options[args[i].substring(2)] = true;
            } else if (args[i].startsWith('-')) {
                result.options[args[i].substring(1)] = true;
            } else {
                result.parameters.push(args[i]);
            }
        }
    }

    return result;
}
