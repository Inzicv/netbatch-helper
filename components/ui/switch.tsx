"use client";

import * as React from "react";

interface SwitchProps {

    checked: boolean;

    onCheckedChange: (checked: boolean) => void;

}

export function Switch({

    checked,

    onCheckedChange

}: SwitchProps) {

    return (

        <button

            type="button"

            role="switch"

            aria-checked={checked}

            onClick={() => onCheckedChange(!checked)}

            className={`
                relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                ${
                    checked

                        ? "bg-violet-600"

                        : "bg-zinc-700"
                }
            `}

        >

            <span

                className={`
                    inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                    ${
                        checked

                            ? "translate-x-6"

                            : "translate-x-1"
                    }
                `}

            />

        </button>

    );

}