function userProfilePage(props) {
  return <h1>{props.username}</h1>;
}

export default userProfilePage;

export async function getServerSideProps(context){
    const { params, req, res } = context;
    console.log(req)
    console.log(res)
    console.log("server side code...");

    return {
        props: {
            username: 'Max'
        }
    }
}