async function GetImage(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
            mode: 'cors'
        });
        const data = await response.json();
        return data.sprites.front_default;
    } catch (error) {
        console.error("Invalid Pokémon", error);
        return null;
    }
}

export default GetImage;