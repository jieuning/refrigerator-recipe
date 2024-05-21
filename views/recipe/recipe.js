const recipeData = async () => {
    const url = 'http://localhost:3000/api/basic';

    try{
        const data = await fetch(url).then((res) => res.json());

        console.log(data);
    }catch(error) {
        console.log(error.message);
    }
};
recipeData();