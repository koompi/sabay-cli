#!/bin/bash

_sabay() {
    local cur prev opts sabay_path stack_list

    # Find the path to the sabay executable
    sabay_path=$(which sabay)

    # Define options
    opts="--token --updatestack --liststack --listservice --logstack"

    # Current and previous word
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    # Complete options if the current word starts with --
    if [[ ${cur} == --* ]]; then
        COMPREPLY=($(compgen -W "${opts}" -- ${cur}))
        return 0
    fi

    case ${prev} in
        --updatestack)
            # Fetch the list of stacks
            stack_list=$(node "${sabay_path}" liststack 2>/dev/null)
            COMPREPLY=($(compgen -W "${stack_list}" -- ${cur}))
            return 0
            ;;
        --listservice)
            # Fetch the list of stacks
            stack_list=$(node "${sabay_path}" liststack 2>/dev/null)
            COMPREPLY=($(compgen -W "${stack_list}" -- ${cur}))
            return 0
            ;;
    esac

    # Fallback to completing commands if not handled by previous cases
    COMPREPLY=($(compgen -W "token updatestack liststack listservice logstack" -- ${cur}))
}

complete -F _sabay sabay
