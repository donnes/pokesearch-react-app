"use client";

import {
  BoltIcon,
  ChevronLeft,
  HeartIcon,
  RulerIcon,
  ShieldIcon,
  StarIcon,
  StarOffIcon,
  SwordIcon,
  WeightIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import * as React from "react";

import { PokeballLoading } from "@/components/composed/pokeball-loading";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
import { useToggleFavoriteMutation } from "@/hooks/use-mutations";
import { useGetFavoriteQuery, useGetPokemonQuery } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";
import type { Pokemon } from "@/schemas/pokemon";

function FavoriteButton({ pokemon }: { pokemon: Pokemon }) {
  const { data: favorite } = useGetFavoriteQuery(pokemon.name);
  const { mutate } = useToggleFavoriteMutation();

  const onClick = React.useCallback(() => {
    mutate({
      name: pokemon.name,
      url: `${env.NEXT_PUBLIC_API_URL}/pokemon/${pokemon.id}/`,
    });
  }, [pokemon, mutate]);

  return (
    <Button
      variant="ghost"
      className={cn("group", {
        "text-yellow-400": !!favorite,
      })}
      onClick={onClick}
    >
      <StarIcon
        className={cn("w-5 h-5 mr-2", {
          "fill-yellow-400 group-hover:hidden": !!favorite,
        })}
      />
      <StarOffIcon
        className={cn("hidden w-5 h-5 mr-2 fill-yellow-400", {
          "group-hover:inline-flex": !!favorite,
        })}
      />
      Favorite
    </Button>
  );
}

export default function PokemonPage() {
  const { id } = useParams<{ id: string }>();

  const { data: pokemon, error, isLoading, isError } = useGetPokemonQuery(id);

  if (isError && error.response?.status === 404) {
    return notFound();
  }

  if (isLoading || !pokemon) {
    return (
      <div className="flex py-6 items-center justify-center">
        <PokeballLoading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-16 items-center justify-between">
        <Button variant="link" className="px-0" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
        </Button>

        <FavoriteButton pokemon={pokemon} />
      </div>

      <div className="pt-12 flex items-center">
        <h1 className="font-bold text-4xl leading-tight">Bulbasaur</h1>

        <div className="flex items-center gap-x-2 pl-4">
          {pokemon.types.map((type) => (
            <Badge
              key={type.type.name}
              variant={type.type.name as keyof BadgeProps["variant"]}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 pt-10">
        <div>
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            width={200}
            height={200}
            quality={60}
            alt="Pokémon"
            className="object-cover w-72 min-h-60"
            priority
          />
        </div>

        <div className="flex flex-col flex-1 gap-8">
          <div>
            <h2 className="text-2xl font-medium">Info</h2>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <h3 className="font-medium">
                  <HeartIcon className="mr-2 inline-block h-5 w-5" />
                  HP
                </h3>
                <p className="text-sm text-gray-400 pt-2">
                  {pokemon.stats.find((stat) => stat.stat.name === "hp")
                    ?.base_stat || 0}
                </p>
              </div>
              <div>
                <h3 className="font-medium">
                  <SwordIcon className="mr-2 inline-block h-5 w-5" />
                  Attack
                </h3>
                <p className="text-sm text-gray-400 pt-2">
                  {pokemon.stats.find((stat) => stat.stat.name === "attack")
                    ?.base_stat || 0}
                </p>
              </div>
              <div>
                <h3 className="font-medium">
                  <ShieldIcon className="mr-2 inline-block h-5 w-5" />
                  Defense
                </h3>
                <p className="text-sm text-gray-400 pt-2">
                  {pokemon.stats.find((stat) => stat.stat.name === "defense")
                    ?.base_stat || 0}
                </p>
              </div>
              <div>
                <h3 className="font-medium">
                  <BoltIcon className="mr-2 inline-block h-5 w-5" />
                  Special Attack
                </h3>
                <p className="text-sm text-gray-400 pt-2">
                  {pokemon.stats.find(
                    (stat) => stat.stat.name === "special-attack",
                  )?.base_stat || 0}
                </p>
              </div>
              <div>
                <h3 className="font-medium">
                  <WeightIcon className="mr-2 inline-block h-5 w-5" />
                  Weight
                </h3>
                <p className="text-sm text-gray-400 pt-2">
                  {pokemon.weight / 10} kg
                </p>
              </div>
              <div>
                <h3 className="font-medium">
                  <RulerIcon className="mr-2 inline-block h-5 w-5" />
                  Height
                </h3>
                <p className="text-sm text-gray-400 pt-2">
                  {pokemon.height / 10} m
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Abilities</h2>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {pokemon.abilities
                .filter(({ ability }) => ability.name)
                .map(({ ability }) => (
                  <div
                    key={ability.name}
                    className="capitalize px-3 py-2 rounded-xl bg-zinc-800"
                  >
                    {ability.name.replace(/-/g, " ")}
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium">Stats</h2>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {pokemon.abilities
                .filter(({ ability }) => ability.name)
                .map(({ ability }) => (
                  <div
                    key={ability.name}
                    className="capitalize px-3 py-2 rounded-xl bg-zinc-800"
                  >
                    {ability.name.replace(/-/g, " ")}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
