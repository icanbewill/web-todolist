
import Table from 'react-bootstrap/Table';
import { FaPencilAlt } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
import Badge from 'react-bootstrap/Badge';
const badges = {
    'a faire': 'primary',
    'en cours': 'warning',
    'fait': 'success',
    'en retard': 'danger'
};

const badgesColors = (badge) => {
    return badges[badge];
}

const TodoList = ({ list, remove, edit }) => {
    return (
        <>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tâche</th>
                        <th>Etat</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {list?.length > 0 ? (
                        <>
                            {list.map((entry, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{entry.libelle}</td>
                                    <td> <Badge className='text-xm text-uppercase badges' bg={badgesColors(entry.state)}>{entry.state}</Badge></td>

                                    <td>
                                        <FaPencilAlt className='icone mx-4' onClick={() => {
                                            edit(entry);
                                        }} />

                                        <FaWindowClose className='icone' onClick={() => {
                                            remove(entry);
                                        }} />
                                    </td>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <tr className="empty">
                            <td>Aucune tâche trouvée</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    );
};

export default TodoList;